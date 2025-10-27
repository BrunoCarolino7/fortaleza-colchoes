using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Enuns;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FortalezaSystem.Infrastructure.Context;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<Clientes> Clientes { get; set; }
    public DbSet<Endereco> Enderecos { get; set; }
    public DbSet<Documento> Documentos { get; set; }
    public DbSet<DadosProfissionais> DadosProfissionais { get; set; }
    public DbSet<Conjuge> Conjuges { get; set; }
    public DbSet<InformacoesPagamento> InformacoesPagamento { get; set; }
    public DbSet<Parcela> Parcelas { get; set; }
    public DbSet<Estoque> Estoque { get; set; }
    public DbSet<FortalezaUser> FortalezaUser { get; set; }
    public DbSet<Pedidos> Pedidos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("fortaleza");

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(decimal)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }

        var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
            d => d.ToDateTime(TimeOnly.MinValue),
            d => DateOnly.FromDateTime(d)
        );

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(DateOnly));

            foreach (var property in properties)
            {
                modelBuilder
                    .Entity(entityType.Name)
                    .Property(property.Name)
                    .HasConversion(dateOnlyConverter)
                    .HasColumnType("date");
            }
        }

        modelBuilder.Entity<Clientes>(builder =>
        {
            builder.ToTable("Clientes");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Nome).HasMaxLength(150);
            builder.Property(c => c.Filiacao).HasMaxLength(150);
            builder.Property(c => c.Nacionalidade).HasMaxLength(50);
            builder.Property(c => c.Naturalidade).HasMaxLength(50);
            builder.Property(c => c.EstadoCivil).HasMaxLength(30);
            builder.Property(c => c.Email).HasMaxLength(30); ;
            builder.Property(c => c.Telefone).HasMaxLength(30);
            builder.Property(c => c.Status).HasDefaultValue(true);

            builder.HasMany(c => c.Enderecos)
                   .WithOne(e => e.Cliente)
                   .HasForeignKey(e => e.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Documento)
                   .WithOne(d => d.Cliente)
                   .HasForeignKey<Documento>(d => d.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.DadosProfissionais)
                   .WithOne(dp => dp.Cliente)
                   .HasForeignKey<DadosProfissionais>(dp => dp.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Conjuge)
                   .WithOne(co => co.Cliente)
                   .HasForeignKey<Conjuge>(co => co.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Pagamento)
                   .WithOne(p => p.Cliente)
                   .HasForeignKey<InformacoesPagamento>(p => p.ClienteId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.FortalezaUser)
                 .WithOne(a => a.Cliente)
                 .HasForeignKey<FortalezaUser>(a => a.ClienteId)
                 .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Estoque)
                .WithOne(es => es.Cliente)
                .HasForeignKey(es => es.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Pedidos)
                .WithOne(es => es.Cliente)
                .HasForeignKey(es => es.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);
        });


        modelBuilder.Entity<Endereco>(builder =>
        {
            builder.ToTable("Enderecos");
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Logradouro).HasMaxLength(200);
            builder.Property(e => e.Numero).HasMaxLength(10);
            builder.Property(e => e.Bairro).HasMaxLength(100);
            builder.Property(e => e.CEP).HasMaxLength(20);
            builder.Property(e => e.Localizacao).HasMaxLength(100);
            builder.Property(e => e.Cidade).HasMaxLength(100);
            builder.Property(e => e.Estado).HasMaxLength(2);
            builder.Property(e => e.ClienteId);
        });

        modelBuilder.Entity<FortalezaUser>(builder =>
        {
            builder.ToTable("FortalezaUser");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Usuario).HasMaxLength(20);
            builder.Property(d => d.SenhaHash).HasMaxLength(50);
        });

        modelBuilder.Entity<Documento>(builder =>
        {
            builder.ToTable("Documentos");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.RG).HasMaxLength(20);
            builder.Property(d => d.CPF).HasMaxLength(14);
        });

        modelBuilder.Entity<DadosProfissionais>(builder =>
        {
            builder.ToTable("DadosProfissionais");
            builder.HasKey(dp => dp.Id);

            builder.Property(dp => dp.Id)
                   .ValueGeneratedOnAdd();

            builder.Property(dp => dp.Empresa).HasMaxLength(150);
            builder.Property(dp => dp.Telefone).HasMaxLength(20);
            builder.Property(dp => dp.Salario).HasColumnType("decimal(18,2)");

            builder.HasOne(dp => dp.EnderecoEmpresa)
                   .WithMany()
                   .HasForeignKey(dp => dp.EnderecoEmpresaId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Conjuge>(builder =>
        {
            builder.ToTable("Conjuges");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Nome).HasMaxLength(150);
            builder.Property(c => c.Naturalidade).HasMaxLength(100);
            builder.Property(c => c.LocalDeTrabalho).HasMaxLength(150);

            builder.HasOne(c => c.Documento)
                   .WithMany()
                   .HasForeignKey(c => c.DocumentoId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<InformacoesPagamento>(builder =>
        {
            builder.ToTable("InformacoesPagamento");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.ValorTotal).HasColumnType("decimal(18,2)");
            builder.Property(p => p.Sinal).HasColumnType("decimal(18,2)");
            builder.Property(p => p.DataInicio);
            builder.Property(p => p.NumeroParcelas);

            builder.HasMany(p => p.Parcelas)
                   .WithOne(pa => pa.InformacoesPagamento)
                   .HasForeignKey(pa => pa.InformacoesPagamentoId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Parcela>(builder =>
        {
            builder.ToTable("Parcelas");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Numero);
            builder.Property(p => p.Valor).HasColumnType("decimal(18,2)");
            builder.Property(p => p.Vencimento);

            builder.Property(p => p.StatusPagamento)
                   .HasConversion<int>()
                   .HasDefaultValue(EStatusPagamento.Pendente);
        });

        modelBuilder.Entity<Estoque>(builder =>
        {
            builder.ToTable("Estoque");
            builder.HasKey(a => a.Id);
        });

        modelBuilder.Entity<Pedidos>(builder =>
        {
            builder.ToTable("Pedidos");
            builder.HasKey(a => a.Id);

            builder.HasOne(p => p.InformacoesPagamento)
                   .WithOne(ip => ip.Pedido)
                   .HasForeignKey<Pedidos>(d => d.InformacoesPagamentoId)
                   .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
